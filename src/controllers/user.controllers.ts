import User from "@/models/user.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import secrets from "@/config/secrets";

//User Registration
export const signUp = async (req, res) => {
    try {
          const { name, phone, email, password } = req.body;
         
          // Hash the user's password before storing it in the database
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // check if all required fields are provided in the request body
          if(!name || !phone || !email || !password){
              return res.status(400).json({message: 'please fill all the fields'})
          }
          // Create a new user in the database
         const user = await User.create({
        name,
        phone,
        email,
        password:hashedPassword

      });
      // Save the user to the database
      user.save();
      // Respond with a success message
      res.status(201).json( 'succesfully registred' );
    } catch (error) {
      // Handle any error that occur during the registration process
      res.status(500).json(error);
    }
  };

// User Login
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user in the database based on the provided email
      const user = await User.findOne({ email });
      // If the user is not found ,respond with an error
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      // check if the provided password matches the storage hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      // If the password is not valid,respond with an authentication error
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      // Generate a JWT  token for the user
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      // Respond with the token, user information , and  a success message
      res.status(200).json({ token, user, message: 'Login successful' });
    } catch (error) {
      // Handle any errors that occur during the login process
      res.status(500).json({ message: 'An error occurred while logging in' });
    }
  };
  
// User Logout
export const logOut = async (req, res) => {
  // Clear the authentication token cookie
    res.cookie(secrets.token, null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    //Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Logout User Successfully',
    });
  };


// Request Password Reset
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      //Find the user in the database based on the provided email
      const user = await User.findOne({ email });
      //Generate a JWT token for password reset with a short expiration time
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      // If the user is not found, respond with an error
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      // Respond with the reset token
      res.status(200).json({token});
    } catch (error) {
      //Handle any errors that occur during the password reset request
      res.status(500).json({ message: 'An error occurred while requesting a password reset' });
    }
  };
  //Reset password
  export const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      const secretKey = 'your-secret-key'; // Replace with your secret key
      const decodedToken = jwt.verify(token, secretKey);//verify the token and extract the user ID

      const userId = decodedToken.userId;
      //Find the user  in the database based on the extracted user ID
      const user = await User.findById(userId);
      // Hash the new password and update the user's password in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      user.password = hashedPassword;
      await user.save();
  //Respond with a success message
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      // Handle any errors that occur during the password reset process
      res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
  };

  export const getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find a user by ID
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Do not include sensitive information like the password in the response
      const { name, phone, email } = user.toObject();
  
      res.status(200).json({ id, name, phone, email });
    } catch (error) {
      // Handle any errors that occurred during the retrieval process
      console.error(error);
      res.status(500).json({ error: "Error retrieving user details" });
    }
  };
  
    

  
  


