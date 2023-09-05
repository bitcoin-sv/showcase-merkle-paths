export type TreePart = TreeNode | TreeLeaf

export interface TreeLeaf {
    height: 0
    hash: string
    offset: number
}

export interface TreeNode {
    height: number
    hash: string
    offset: number
    left: TreePart
    right: TreePart
}

export type MerkleTree = TreeNode

export type CompoundMerkleProof = Record<string,number>[]

export interface MerkleProof {
    index: number,
    path: string[]
}

export type MerkleProofByTx = Record<string, MerkleProof>
