import { MerkleTreeView } from "./components/MerkleTreeView/MerkleTreeView.tsx";
import { MerkleTreeProvider } from "./providers/MerkleTreeProvider/MerkleTreeProvider.tsx";
import { MerkleTreeSizeSelector } from "./components/MerkleTreeSizeSelector/MerkleTreeSizeSelector.tsx";
import { MerkleProofProvider } from "./providers/MerkleProofsProvider/MerkleProofsProvider.tsx";
import { MerkleProofsView } from "./components/MerkleProofsView/MerkleProofsView.tsx";
import { ResetProvider } from "./providers/ResetStateProvider/ResetStateProvider.tsx";
import { TscMerkleProofsView } from "./components/TscMerkleProofsView/TscMerkleProofsView.tsx";
import { BsvUnifiedMerklePathView } from "./components/BsvUnifiedMerklePathView/BsvUnifiedMerklePathView.tsx";
import { Grid } from "@mui/material";

function App() {
  return (
    <ResetProvider>
      <MerkleTreeProvider>
        <MerkleProofProvider>
          <Grid container>
            <Grid item xs={12}>
              <MerkleTreeSizeSelector />
            </Grid>
            <Grid item xs={12} sx={{ overflow: "auto" }}>
              <MerkleTreeView />
            </Grid>
            <Grid item xs={12}>
              <MerkleProofsView />
            </Grid>

            <Grid item xs={12}>
              <BsvUnifiedMerklePathView />
            </Grid>
            <Grid item xs={12}>
              <TscMerkleProofsView />
            </Grid>
          </Grid>
        </MerkleProofProvider>
      </MerkleTreeProvider>
    </ResetProvider>
  );
}

export default App;
