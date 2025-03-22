require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5005;

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB подключён"))
  .catch((err) => console.error("Ошибка подключения к MongoDB", err));

// Миддлвары
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Настройка multer для загрузки аватаров
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Модель пользователя
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  transactions: { type: Array, default: [] },
  avatar: { type: String, default: "" },
});

const User = mongoose.model("User", UserSchema);

// Регистрация
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    res
      .cookie("userId", user._id.toString(), { httpOnly: true })
      .json({ success: true, userId: user._id });
  } catch (err) {
    res.status(400).json({ success: false, message: "Registration error" });
  }
});

// Вход
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ success: false, message: "Email not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }

  res
    .cookie("userId", user._id.toString(), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json({ success: true, userId: user._id });
});

// Получение профиля
app.get("/profile", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        transactions: user.transactions || [],
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Обновление аватара
app.patch("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ success: true, avatar: user.avatar });
  } catch (error) {
    console.error("Ошибка при загрузке аватара:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Выход
app.post("/logout", (req, res) => {
  res
    .clearCookie("userId")
    .json({ success: true, message: "Вы вышли из аккаунта" });
});

// Обновление баланса
app.patch("/balance", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const { amount } = req.body;
    if (typeof amount !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.balance += amount;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Balance updated",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Ошибка при обновлении баланса:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Удаление аккаунта
app.delete("/delete-account", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .clearCookie("userId")
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Запуск сервера
app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);

// Обновление email
app.patch("/update-email", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const { email } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Обновляем email в базе без удаления пользователя
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { email: email.toLowerCase() } },
      { new: true } // Возвращает обновлённого пользователя
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("Ошибка при обновлении email:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
