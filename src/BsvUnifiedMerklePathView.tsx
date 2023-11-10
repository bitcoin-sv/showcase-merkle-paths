import {useMerklePath} from "./MerkleProofsProvider.tsx";
import * as _ from "lodash";
import {NoTransactionSelected} from "./NoTransactionSelected.tsx";
import './BsvUnifiedMerklePathView.css'
import {MerkleProof, MerkleProofByTx, TreePart} from "./merkle-tree-data";

type BumpLeaf = {
    hash: string,
    txid?: true,
    offset: number,
} | {
    offset: number,
    duplicate: true
}

interface MerklePathLeaf {
    hash: string,
    txid?: true,
    duplicate?: boolean,
    offset: number,
    height: number,
}

export const BsvUnifiedMerklePathView = () => {
    const {proof} = useMerklePath();

    const BUMP = {
        blockHeight: 987_654_321,
        path: toBumpPaths(proof)
    }

    return <article className='bump-view'>
        <header>BUMP:</header>
        {_.isEmpty(proof)
            ? <NoTransactionSelected/> :
            <pre>{JSON.stringify(BUMP, ["blockHeight", "path", "offset", "hash", "txid", "duplicate"], 2)}</pre>
        }
    </article>
}

function toBumpPaths(proof: MerkleProofByTx) {
    return _(proof).entries()
        .flatMap(it => [
                toLeaf(it),
                ...(toLeafs(it[1].path)),
            ]
        )
        .groupBy('hash')
        .entries()
        .flatMap(([, leafs]) => leafs.reduce(_.merge))
        .transform((bump, {height, ...it}) => {
            const pathAtHeight = bump[height] || []
            pathAtHeight.push(it.duplicate ? {offset: it.offset, duplicate: true} : {...it})
            bump[height] = pathAtHeight
            return bump
        }, [] as BumpLeaf[][])
        .value();
}

function toLeafs(path: TreePart[]): MerklePathLeaf[] {
    return path.map(p => ({hash: p.hash, offset: p.offset, height: p.height, duplicate: p.duplicated}));
}

function toLeaf(it: [string, MerkleProof]): MerklePathLeaf {
    return {
        hash: it[0],
        txid: true,
        offset: it[1].index,
        height: 0,
    };
}
