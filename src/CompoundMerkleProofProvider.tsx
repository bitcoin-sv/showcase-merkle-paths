import {CompoundMerkleProof, TreePart} from "./merkle-tree-data";
import {createContext, FC, PropsWithChildren, useContext, useState} from "react";
import * as _ from "lodash";
import {useReset} from "./useReset.tsx";

interface ContextValue {
    value: CompoundMerkleProof
    setValue: (proof: CompoundMerkleProof) => void
}

const Context = createContext<ContextValue | undefined>(undefined)
Context.displayName = 'CompoundMerkleProofProvider'

export const CompoundMerkleProofProvider: FC<PropsWithChildren> = ({children}) => {
    const [value, setValue] = useState<CompoundMerkleProof>([])
    const {addListener} = useReset()
    addListener("cmp", () => setValue([]))

    return <Context.Provider value={{
        value,
        setValue,
    }}>{children}</Context.Provider>
}

const useCmpContext = () => {
    const ctx = useContext(Context)
    if (!ctx) {
        throw new Error('useCompoundMerkleProof must be used within CompoundMerkleProofProvider')
    }
    return ctx
}

export const useCompoundMerkleProof = () => {
    const ctx = useCmpContext()
    return {
        proof: ctx.value,
        add: (node: TreePart) => {
            const cmp = addNodeToCmp(node, ctx.value)
            ctx.setValue(cmp)
        },
        remove: (node: TreePart) => {
            const cmp = removeFromCmp(node, ctx.value)
            ctx.setValue(cmp)
        }
    }
}

export const addNodeToCmp = (node: TreePart, prvCmp: CompoundMerkleProof): CompoundMerkleProof => {
    let cmp: CompoundMerkleProof
    if (node.height >= prvCmp.length) {
        cmp = _.times(node.height + 1, () => ({}))
        prvCmp.forEach((it, index) => cmp[index] = it)
    } else {
        cmp = [...prvCmp]
    }

    const cmpAtHeight = cmp[node.height]
    cmpAtHeight[node.hash] = node.offset
    prvCmp.splice(0, prvCmp.length)
    prvCmp.push(...cmp)
    return cmp;
}

export const removeFromCmp = (node: TreePart, prvCmp: CompoundMerkleProof): CompoundMerkleProof => {
    if (prvCmp.length <= node.height) {
        return prvCmp
    }

    const entry = prvCmp[node.height]
    const exist = entry[node.hash] != undefined
    if (!exist) {
        return prvCmp
    }
    const cmp: CompoundMerkleProof = []
    prvCmp.forEach((it, index) => {
        cmp[index] = {
            ...it
        }
        if (index == node.height) {
            delete cmp[index][node.hash]
        }
    })

    if (cmp.length == node.height + 1) {
        let idx = cmp.length - 1
        while (idx >= 0 && _.isEmpty(cmp[idx])) {
            cmp.pop()
            idx -= 1
        }

    }
    prvCmp.splice(0, prvCmp.length)
    prvCmp.push(...cmp)
    return cmp

}
