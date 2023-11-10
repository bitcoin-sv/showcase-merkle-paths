import {MerkleTreeView} from "./MerkleTreeView.tsx";
import {MerkleTreeProvider} from "./MerkleTreeProvider.tsx";
import {MerkleTreeSizeSelector} from "./MerkleTreeSizeSelector.tsx";
import {MerkleProofProvider} from "./MerkleProofsProvider.tsx";
import {MerkleProofsView} from "./MerkleProofsView.tsx";
import {ResetProvider} from "./useReset.tsx";
import {TscMerkleProofsView} from "./TscMerkleProofsView.tsx";
import {BsvUnifiedMerklePathView} from "./BsvUnifiedMerklePathView.tsx";
import {Grid} from "@mui/material";

function App() {
    return (
        <ResetProvider>
            <MerkleTreeProvider>
                <MerkleProofProvider>
                    <Grid container>
                        <Grid item xs={12}>
                            <MerkleTreeSizeSelector/>
                        </Grid>
                        <Grid item xs={12} sx={{overflow: 'auto'}}>
                            <MerkleTreeView/>
                        </Grid>
                        <Grid item xs={12}>
                            <MerkleProofsView/>
                        </Grid>

                        <Grid item xs={12}>
                            <BsvUnifiedMerklePathView/>
                        </Grid>
                        <Grid item xs={12}>
                            <TscMerkleProofsView/>
                        </Grid>
                    </Grid>
                </MerkleProofProvider>
            </MerkleTreeProvider>
        </ResetProvider>
    )
}

export default App

