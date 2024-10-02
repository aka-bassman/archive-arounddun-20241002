"use client";
import { cnst, st } from "@shared/client";

interface UserProps {
  children?: React.ReactNode | React.ReactNode[];
  roles?: cnst.UserRole[];
  showUnauhtorized?: boolean;
}
export const User = ({ children, roles, showUnauhtorized }: UserProps) => {
  const storeUse = st.use as unknown as { [key: string]: <T>() => T };
  const self = storeUse.self<cnst.User>();
  if (!self.id) return null;
  if (roles?.every((role) => !self.roles.includes(role))) return null;
  return <>{children}</>;
};
