import { useNavigate } from "react-router-dom";
import { RoleSelector } from "@/components/RoleSelector";
import { useEffect } from "react";

type UserRole = "L1_MASTER_ADMIN" | "L2_EXEC_ADMIN" | "L3_CITIZEN" | null;

const Index = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    // Navigate to signin page with role parameter
    navigate(`/signin?role=${role}`);
  };

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
};

export default Index;
