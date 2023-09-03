import {describe, expect, test} from "vitest";
import {CompoundMerkleProof, TreeLeaf} from "./merkle-tree-data";
import {addNodeToCmp, removeFromCmp} from "./CompoundMerkleProofProvider.tsx";

describe('addToCmp', () => {
    test('add height 1 to empty CMP', () => {
        const node = {
            hash: 'A',
            offset: 0,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }

        const cmp = addNodeToCmp(node, [])

        expect(cmp).toMatchInlineSnapshot(`
          [
            {},
            {
              "A": 0,
            },
          ]
        `)
    })
    test('add height 0 to empty CMP', () => {
        const cmp = addNodeToCmp(SOME_LEAF, [])

        expect(cmp).toMatchInlineSnapshot(`
          [
            {
              "EXAMPLE": 0,
            },
          ]
        `)
    })
    test('add height 1 to CMP with height 0', () => {
        const prvCmp = addNodeToCmp(SOME_LEAF, [])
        const node = {
            hash: 'A',
            offset: 0,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }
        const cmp = addNodeToCmp(node, prvCmp)

        expect(cmp).toMatchInlineSnapshot(`
          [
            {
              "EXAMPLE": 0,
            },
            {
              "A": 0,
            },
          ]
        `)
    })
    test('add height 1 to CMP with height 1', () => {
        const prvNode = {
            hash: 'A',
            offset: 0,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }
        const prvCmp = addNodeToCmp(prvNode, [])


        const node = {
            hash: 'B',
            offset: 1,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }
        const cmp = addNodeToCmp(node, prvCmp)

        expect(cmp).toMatchInlineSnapshot(`
          [
            {},
            {
              "A": 0,
              "B": 1,
            },
          ]
        `)
    })
});

describe('removeNodeFromCmp', () => {
    test('remove from height 1', () => {
        const node = {
            hash: 'A',
            offset: 0,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }

        const prvCmp: CompoundMerkleProof = [{}, {"A": 0}]

        const cmp = removeFromCmp(node, prvCmp)

        expect(cmp).toMatchInlineSnapshot('[]')

    })
    test('remove from node that is not in cmp', () => {
        const node = {
            hash: 'B',
            offset: 1,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }

        const prvCmp: CompoundMerkleProof = [{}, {"A": 0}]

        const cmp = removeFromCmp(node, prvCmp)

        expect(cmp).toMatchInlineSnapshot(`
          [
            {},
            {
              "A": 0,
            },
          ]
        `)
    })

    test('remove node from level that is not in cmp', () => {
        const node = {
            hash: 'B',
            offset: 1,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }

        const prvCmp: CompoundMerkleProof = [{"A": 0}]

        const cmp = removeFromCmp(node, prvCmp)

        expect(cmp).toMatchInlineSnapshot(`
          [
            {
              "A": 0,
            },
          ]
        `)
    })

    test('remove from height 1 when there are 2 entries', () => {
        const node = {
            hash: 'B',
            offset: 1,
            height: 1,
            left: SOME_LEAF,
            right: SOME_LEAF,
        }

        const prvCmp: CompoundMerkleProof = [{}, {"A": 0, "B": 1}]

        const cmp = removeFromCmp(node, prvCmp)

        expect(cmp).toMatchInlineSnapshot(`
          [
            {},
            {
              "A": 0,
            },
          ]
        `)
    })
});

const SOME_LEAF: TreeLeaf = {
    hash: 'EXAMPLE',
    offset: 0,
    height: 0
}
