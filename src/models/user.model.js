const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { BCRYPT_SALT } = require("./../config");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: true,
            trim: true,
            enum: ["user", "admin"],
            default: "user"
        },
        is_active: {
            type: Boolean,
            required: true,
            default: true
        },
        is_verified: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const hash = await bcrypt.hash(this.password, BCRYPT_SALT);
    this.password = hash;

    next();
});

module.exports = mongoose.model("user", userSchema);
