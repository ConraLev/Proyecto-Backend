const User = require('../dao/models/user.model');

class UserController {
    async changeUserRole(userId, newRole) {
        try {
            if (newRole !== 'user' && newRole !== 'premium') {
                throw new Error('Rol inválido. Debe ser "user" o "premium"');
            }

            const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { UserController };
