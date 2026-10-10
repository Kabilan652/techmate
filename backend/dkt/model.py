import torch
import torch.nn as nn

class DKTModel(nn.Module):
    def __init__(self, num_skills, hidden_dim=64, num_layers=1):
        super().__init__()
        self.num_skills = num_skills
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers

        self.embedding = nn.Embedding(num_skills, hidden_dim)
        self.rnn = nn.GRU(
            input_size=hidden_dim + 1,  # skill embedding + correctness label
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True
        )
        self.output = nn.Linear(hidden_dim, num_skills)

    def forward(self, skills, answers):
        """
        skills: (batch, seq_len)
        answers: (batch, seq_len)
        """
        skill_emb = self.embedding(skills)  # (batch, seq_len, hidden_dim)
        inputs = torch.cat([skill_emb, answers.unsqueeze(-1).float()], dim=-1)
        out, _ = self.rnn(inputs)
        logits = self.output(out)
        return logits
