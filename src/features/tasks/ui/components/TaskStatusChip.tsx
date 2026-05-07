import { Chip } from '@mui/material';

interface Props {
  done: boolean;
}

export const TaskStatusChip = ({ done }: Props) => {
  return (
    <Chip
      size="small"
      label={done ? 'Finalizada' : 'Pendiente'}
      color={done ? 'success' : 'warning'}
      variant={done ? 'filled' : 'outlined'}
    />
  );
};
