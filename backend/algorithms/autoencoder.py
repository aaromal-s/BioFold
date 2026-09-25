import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from utils.logger import setup_logger

logger = setup_logger(__name__)

class AutoencoderModel(nn.Module):
    def __init__(self, input_dim, encoding_dim=2):
        super(AutoencoderModel, self).__init__()
        # Encoder
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, encoding_dim)
        )
        # Decoder
        self.decoder = nn.Sequential(
            nn.Linear(encoding_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 128),
            nn.ReLU(),
            nn.Linear(128, input_dim),
            nn.Sigmoid()  # assuming data is scaled [0,1] or standard
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

def apply_autoencoder(df: pd.DataFrame, n_components: int = 2, epochs: int = 50, batch_size: int = 32) -> np.ndarray:
    """
    Apply PyTorch Autoencoder dimensionality reduction.
    """
    logger.info(f"Running Autoencoder: epochs={epochs}, batch_size={batch_size}, n_components={n_components}")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Convert to tensor
    tensor_x = torch.Tensor(df.values)
    dataset = TensorDataset(tensor_x, tensor_x)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    model = AutoencoderModel(input_dim=df.shape[1], encoding_dim=n_components).to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    
    # Train
    model.train()
    for epoch in range(epochs):
        for data in dataloader:
            inputs, _ = data
            inputs = inputs.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, inputs)
            loss.backward()
            optimizer.step()
            
    # Extract embeddings
    model.eval()
    with torch.no_grad():
        embeddings = model.encoder(tensor_x.to(device)).cpu().numpy()
        
    logger.info(f"Autoencoder complete. Output shape: {embeddings.shape}")
    return embeddings
