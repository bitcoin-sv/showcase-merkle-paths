import {MerkleTreeView} from "./MerkleTreeView.tsx";
import {MerkleTreeProvider} from "./MerkleTreeProvider.tsx";
import {MerkleTreeSizeSelector} from "./MerkleTreeSizeSelector.tsx";
import {CompoundMerkleProofProvider} from "./CompoundMerkleProofProvider.tsx";
import {CompoundMerkleProofView} from "./CompoundMerkleProofView.tsx";
import {MerkleProofProvider} from "./MerkleProofsProvider.tsx";
import {MerkleProofsView} from "./MerkleProofsView.tsx";
import {ResetProvider} from "./useReset.tsx";
import {TscMerkleProofsView} from "./TscMerkleProofsView.tsx";


function App() {
    return (
        <ResetProvider>
            <MerkleTreeProvider>
                <CompoundMerkleProofProvider>
                    <MerkleProofProvider>
                        <MerkleTreeSizeSelector/>
                        <MerkleTreeView/>
                        <MerkleProofsView />
                        <CompoundMerkleProofView/>
                        <TscMerkleProofsView />
                    </MerkleProofProvider>
                </CompoundMerkleProofProvider>
            </MerkleTreeProvider>
        </ResetProvider>
    )
}

export default App

