import { describe, expect, test } from "vitest";
import { TreePart } from "./merkle-tree-data";
import { addNodeToProof } from "./MerkleProofsProvider.tsx";

describe("MerkleProofProvider mutations", () => {
  describe("addNodeToProof", () => {
    test("add nodes sequentially to empty proofs", () => {
      const proof = {};
      HASH1_NODES.forEach((it) => addNodeToProof(HASH1, it, proof));

      expect(proof).toMatchInlineSnapshot(`
              {
                "A": {
                  "index": 0,
                  "path": [
                    "B",
                    "CD",
                  ],
                },
              }
            `);
    });

    test("add multiple proofs sequentially to empty proofs", () => {
      const proof = {};
      HASH1_NODES.forEach((it) => addNodeToProof(HASH1, it, proof));

      HASH2_NODES.forEach((it) => addNodeToProof(HASH2, it, proof));

      expect(proof).toMatchInlineSnapshot(`
              {
                "A": {
                  "index": 0,
                  "path": [
                    "B",
                    "CD",
                  ],
                },
                "C": {
                  "index": 2,
                  "path": [
                    "D",
                    "AB",
                  ],
                },
              }
            `);
    });
  });
});

const HASH1 = "A";
const HASH2 = "C";

const HASH1_NODES: TreePart[] = [
  {
    height: 0,
    hash: HASH1,
    offset: 0,
  },
  {
    height: 0,
    hash: "B",
    offset: 1,
  },
  {
    height: 1,
    hash: "CD",
    offset: 1,
    left: {
      height: 0,
      hash: HASH2,
      offset: 2,
    },
    right: {
      height: 0,
      hash: "D",
      offset: 3,
    },
  },
];

const HASH2_NODES: TreePart[] = [
  {
    height: 0,
    hash: HASH2,
    offset: 2,
  },
  {
    height: 0,
    hash: "D",
    offset: 3,
  },
  {
    height: 1,
    hash: "AB",
    offset: 0,
    left: {
      height: 0,
      hash: HASH1,
      offset: 0,
    },
    right: {
      height: 0,
      hash: "B",
      offset: 1,
    },
  },
];
