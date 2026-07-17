import { describe, expect, it } from "vitest";
import { walkTree, type WalkContext } from "./tree.js";

interface Node {
  id: number;
  children?: Node[];
}

//        1
//      /   \
//     2     3
//    / \
//   4   5
const tree: Node = {
  id: 1,
  children: [
    { id: 2, children: [
      { id: 4 },
      { id: 5 }
    ] },
    { id: 3 },
  ],
};

const getChildren = (node: Node) => node.children ?? [];

describe("tree", () => {

  describe("walkTree", () => {

    it("visits every node in pre-order when work precedes visitChildren", () => {
      const seen: number[] = [];
      walkTree(tree, getChildren, (node, visitChildren) => {
        seen.push(node.id);
        visitChildren();
      });
      expect(seen).toEqual([1, 2, 4, 5, 3]);
    });

    it("collects post-order when work follows visitChildren", () => {
      const seen: number[] = [];
      walkTree(tree, getChildren, (node, visitChildren) => {
        visitChildren();
        seen.push(node.id);
      });
      expect(seen).toEqual([4, 5, 2, 3, 1]);
    });

    it("accepts an array of roots (forest)", () => {
      const forest = [{ id: 10 }, { id: 20, children: [{ id: 21 }] }];
      const seen: number[] = [];
      walkTree(forest, getChildren, (node, visitChildren) => {
        seen.push(node.id);
        visitChildren();
      });
      expect(seen).toEqual([10, 20, 21]);
    });

    it("handles a leaf root", () => {
      const seen: number[] = [];
      walkTree({ id: 99 }, getChildren, (node, visitChildren) => {
        seen.push(node.id);
        visitChildren();
      });
      expect(seen).toEqual([99]);
    });

    it("provides node, depth, parent context and index for each node", () => {

      const contexts = new Map<number, WalkContext<Node>>();

      walkTree(tree, getChildren, (node, visitChildren, ctx) => {
        contexts.set(node.id, ctx);
        visitChildren();
      });

      expect(contexts.get(1)).toMatchObject({ depth: 0, parent: null, index: 0 });
      expect(contexts.get(1)!.node.id).toBe(1);
      expect(contexts.get(3)).toMatchObject({ depth: 1, index: 1 });
      expect(contexts.get(3)!.parent?.node.id).toBe(1);

      const ctx4 = contexts.get(4)!;
      expect(ctx4.node.id).toBe(4);
      expect(ctx4.depth).toBe(2);
      expect(ctx4.parent?.node.id).toBe(2);
      expect(ctx4.index).toBe(0);

      // Walk the parent chain to reconstruct the ancestors (root → parent).
      const ancestors: number[] = [];
      for (let c = ctx4.parent; c !== null; c = c.parent) {
        ancestors.push(c.node.id);
      }
      ancestors.reverse();
      expect(ancestors).toEqual([1, 2]);
    });

    it("prunes a subtree when visitChildren is not called", () => {
      const seen: number[] = [];
      walkTree(tree, getChildren, (node, visitChildren) => {
        seen.push(node.id);
        if (node.id !== 2) {
          visitChildren(); // do not descend into 2
        }
      });
      expect(seen).toEqual([1, 2, 3]); // 4 and 5 never visited
    });

    it("aggregates children results bottom-up (subtree size)", () => {
      // R can't be inferred here (it appears in both visitChildren's result and
      // the return), so it must be given explicitly.
      const [size] = walkTree<Node, number>(
        tree,
        getChildren,
        (_node, visitChildren) => 1 + visitChildren().reduce((a, b) => a + b, 0),
      );
      expect(size).toBe(5); // 1 + 2 + 3 + 4 + 5 nodes
    });

    it("returns one result per root for a forest", () => {
      const forest = [{ id: 10 }, { id: 20, children: [{ id: 21 }, { id: 22 }] }];
      const sizes = walkTree<Node, number>(forest, getChildren, (_node, visitChildren) =>
        1 + visitChildren().reduce((a, b) => a + b, 0),
      );
      expect(sizes).toEqual([1, 3]);
    });

    it("transforms the tree into a new shape", () => {
      interface Out { id: number; kids: Out[] }
      const [copy] = walkTree<Node, Out>(tree, getChildren, (node, visitChildren) => ({
        id: node.id * 10,
        kids: visitChildren(),
      }));
      expect(copy).toEqual({
        id: 10,
        kids: [
          { id: 20, kids: [{ id: 40, kids: [] }, { id: 50, kids: [] }] },
          { id: 30, kids: [] },
        ],
      });
    });

  });

});
