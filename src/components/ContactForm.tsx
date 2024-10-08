'use client';

import { useState } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import emailjs from 'emailjs-com';

// Define the shape of the form data
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Pass FormData as a generic type to useForm
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // Change the type of onSubmit to SubmitHandler<FormData>
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
      };

      // Replace these with your EmailJS keys
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      await emailjs.send(serviceId!, templateId!, templateParams, userId!);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  if (isSubmitted) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Thank you for your message. We'll get back to you soon!</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        InputProps={{
          style: {
            color: '#000',  // Bright text color
            backgroundColor: '#fff',  // Lighter background
          },
        }}
        {...register('name', { required: 'Name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        InputProps={{
          style: {
            color: '#000',  // Bright text color
            backgroundColor: '#fff',  // Lighter background
          },
        }}
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Message"
        multiline
        rows={4}
        InputProps={{
          style: {
            color: '#000',  // Bright text color
            backgroundColor: '#fff',  // Lighter background
          },
        }}
        {...register('message', { required: 'Message is required' })}
        error={!!errors.message}
        helperText={errors.message?.message}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Send Message
      </Button>
    </Box>
  );
};

export default ContactForm;
