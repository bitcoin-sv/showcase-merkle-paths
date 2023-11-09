import {MerkleTreeView} from "./MerkleTreeView.tsx";
import {MerkleTreeProvider} from "./MerkleTreeProvider.tsx";
import {MerkleTreeSizeSelector} from "./MerkleTreeSizeSelector.tsx";
import {MerkleProofProvider} from "./MerkleProofsProvider.tsx";
import {MerkleProofsView} from "./MerkleProofsView.tsx";
import {ResetProvider} from "./useReset.tsx";
import {TscMerkleProofsView} from "./TscMerkleProofsView.tsx";
import {BsvUnifiedMerklePathView} from "./BsvUnifiedMerklePathView.tsx";


function App() {
    return (
        <ResetProvider>
            <MerkleTreeProvider>
                    <MerkleProofProvider>
                        <MerkleTreeSizeSelector/>
                        <MerkleTreeView/>
                        <MerkleProofsView />
                        <BsvUnifiedMerklePathView />
                        <TscMerkleProofsView />
                    </MerkleProofProvider>
            </MerkleTreeProvider>
        </ResetProvider>
    )
}

export default App

