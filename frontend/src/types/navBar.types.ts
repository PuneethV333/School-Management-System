export type ChangePasswordModalProps = {
  onClose: () => void;
  onSubmit: (oldPass: string, newPass: string) => void;
  loading: boolean;
};