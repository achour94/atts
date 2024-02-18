//custom hook to get if the user is allowed to see a component

import { useSelector } from "react-redux";
import { selectUserRoles } from "../features/auth/authSlice";



const useRole = (allowedRoles: string[]) => {
    const roles = useSelector(selectUserRoles);

    return allowedRoles.some((role) => roles.includes(role));
}

export default useRole;