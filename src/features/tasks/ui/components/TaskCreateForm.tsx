import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Paper, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';

interface Props {
  isCreating: boolean;
  onCreate: (name: string) => Promise<boolean>;
}

export const TaskCreateForm = ({ isCreating, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();

    if (!normalizedName) {
      setError('El nombre de la tarea es obligatorio.');
      return;
    }

    setError('');
    const created = await onCreate(normalizedName);
    if (created) {
      setName('');
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }} component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Nueva tarea"
          placeholder="Escribe la tarea..."
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError('');
          }}
          disabled={isCreating}
          error={!!error}
          helperText={error}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isCreating}
          startIcon={<AddIcon />}
          sx={{ minWidth: 150 }}
        >
          {isCreating ? 'Guardando...' : 'Agregar'}
        </Button>
      </Box>
    </Paper>
  );
};
