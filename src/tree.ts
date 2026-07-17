export interface WalkContext<T> {
  /** The node this context describes. */
  readonly node: T;
  /**
   * The parent's context, or `null` for a root node. Walk this chain
   * (`ctx.parent`, `ctx.parent.parent`, …) to reach any ancestor.
   */
  readonly parent: WalkContext<T> | null;
  /** Distance from the root: 0 for a root node, 1 for its children, etc. */
  readonly depth: number;
  /** The node's position among its siblings (or among the roots). */
  readonly index: number;
}

/**
 * Walks a tree (or forest) depth-first, folding it into a value per root while
 * giving `visit` explicit control over the recursion. Accepts a single root or
 * an array of roots and returns one result per root.
 *
 * `visit` receives the node, a `visitChildren` thunk, and the node's
 * {@link WalkContext}. Calling `visitChildren()` recurses into the node's
 * children and returns **their** `visit` results, so a parent can combine them
 * (bottom-up aggregation). Where you call it decides the order — work before is
 * pre-order, work after is post-order; **not** calling it prunes the subtree.
 *
 * `getChildren` returns the children to descend into (an empty array for a leaf)
 * and receives the node's context.
 *
 * `R` defaults to `void` for side-effect-only walks; for aggregation it usually
 * can't be inferred (it appears in both `visitChildren`'s result and the return)
 * so pass it explicitly, e.g. `walkTree<Node, number>(...)`. Note:
 * `visitChildren()` re-runs the recursion on each call, so call it once per node.
 *
 * @example
 * // Side-effect walk (pre-order): work runs before descending.
 * walkTree(root, (n) => n.children ?? [], (node, visitChildren) => {
 *   console.log(node.name);
 *   visitChildren();
 * });
 *
 * @example
 * // Bottom-up aggregation: size of each subtree (R given explicitly).
 * const [size] = walkTree<Node, number>(root, (n) => n.children ?? [],
 *   (node, visitChildren) => 1 + visitChildren().reduce((a, b) => a + b, 0),
 * );
 *
 * @example
 * // Transform: rebuild the tree into a new shape.
 * const [copy] = walkTree(root, (n) => n.children ?? [], (node, visitChildren) => ({
 *   label: node.name.toUpperCase(),
 *   kids: visitChildren(),
 * }));
 */
export function walkTree<T, R = void>(
  roots: T | readonly T[],
  getChildren: (
    node: T,
    ctx: WalkContext<T>
  ) => readonly T[],
  visit: (
    node: T,
    visitChildren: () => R[],
    ctx: WalkContext<T>
  ) => R,
): R[] {

  // Normalize to a list of roots. Note: if `T` is itself an array type, pass an
  // explicit array of roots to avoid the ambiguity here.
  const rootList: readonly T[] = Array.isArray(roots) ? (roots as readonly T[]) : [roots as T];

  const visitNode = (
    node: T,
    parent: WalkContext<T> | null,
    depth: number,
    index: number,
  ): R => {

    const ctx: WalkContext<T> = { node, parent, depth, index };

    // Lazily recurse: only descends when the caller invokes it, and hands back
    // the children's `visit` results for the parent to combine.
    const visitChildren = (): R[] => {

      const children = getChildren(node, ctx) ?? [];

      const results: R[] = [];

      for (let i = 0; i < children.length; i++) {
        // `ctx` is the children's parent context — the ancestor chain links here.
        results.push(visitNode(children[i]!, ctx, depth + 1, i));
      }

      return results;
    };

    return visit(
      node,
      visitChildren,
      ctx
    );
  };

  return rootList
    .map(
      (node, index) => visitNode(node, null, 0, index)
    );
}
