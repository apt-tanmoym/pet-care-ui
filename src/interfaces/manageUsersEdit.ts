import { User } from '@/interfaces/user';


export interface ManageUsersEditProps {
  user: User;
  onSubmit: (data: User & { image?: File | null }) => void;
  onCancel: () => void;
  roleGroupList: { roleGroupId: number; roleGroupName: string }[];
}