import { pick } from "lodash"

export const pickUser = (user) => {
    if (!user) return {};
    const result = pick(user, ['_id', 'usr_email', 'usr_name', 'usr_avatar', 'user_address', 'usr_status', 'createdAt', 'updatedAt']);

    if (user.usr_role && user.usr_role.rol_name) {
        result.usr_role = user.usr_role.rol_name;
    } else {
        result.usr_role = null;
    }

    return result;
};