export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  profileImageUrl: string;
  headline: string;
  linkedinProfileUrl: string;
}
export interface LoginUserDto {
  email: string;
  password: string;
}
export class CreateTodoDto {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  categories: string;
  User: string;
}
