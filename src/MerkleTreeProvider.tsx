import {FC, PropsWithChildren, createContext, useState, useContext} from 'react'
import {MerkleTree, TreeLeaf, TreePart} from "./merkle-tree-data";
import {chunk} from "lodash";

interface MerkleTreeDataContextValue {
    tree: MerkleTree
    setTree: (tree: MerkleTree) => void
}

const MerkleTreeDataContext = createContext<MerkleTreeDataContextValue | undefined>(undefined)
MerkleTreeDataContext.displayName = 'MerkleTreeDataContext'

export const MerkleTreeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [tree, setTree] = useState<MerkleTree>(createTreeOfSize(2))

    const value = {
        tree,
        setTree,
    }
    return <MerkleTreeDataContext.Provider value={value}>{children}</MerkleTreeDataContext.Provider>
}

export const useMerkleTree = () => {
    const ctx = useContext(MerkleTreeDataContext)
    if (!ctx) {
        throw new Error('useMerkleTree must be used within MerkleTreeDataContext')
    }
    return {
        tree: ctx.tree,
        setTreeOfSize: (size: number) => {
            const newTree = createTreeOfSize(size)
            ctx.setTree(newTree)
        }
    }
}

const hashes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Z0', 'Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8', 'Z9',]

export function createTreeOfSize(selectedSize: number) {
    const leafs = hashes.slice(0, selectedSize)
        .map((hash, offset) => ({
            hash,
            offset,
            height: 0
        } as TreeLeaf))

    let tree: TreePart[] = [...leafs]

    while (tree.length != 1) {
        const pairs = chunk(tree, 2)
        tree = pairs.map<TreePart>((pair, offset) => ({
            hash: pair[0].hash + pair[1].hash,
            offset,
            height: pair[0].height + 1,
            left: pair[0],
            right: pair[1]
        }))
    }

    return tree[0] as MerkleTree
}


