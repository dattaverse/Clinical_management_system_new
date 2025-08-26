/*
  # Disable Email Confirmation

  This migration disables email confirmation requirements by:
  1. Updating all existing users to have confirmed emails
  2. Creating a trigger to auto-confirm new user emails
  3. Documentation for manual Supabase dashboard settings

  ## Changes Made
  1. Auto-confirm all existing users
  2. Create trigger for new users
  3. Instructions for dashboard settings
*/

-- Update all existing users to have confirmed emails
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- Create a function to auto-confirm emails
CREATE OR REPLACE FUNCTION auto_confirm_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm email for new users
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-confirm emails for new users
DROP TRIGGER IF EXISTS auto_confirm_email_trigger ON auth.users;
CREATE TRIGGER auto_confirm_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user_email();

-- Note: You still need to manually disable email confirmation in Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Under "Email Auth" section
-- 3. Turn OFF "Enable email confirmations"
-- 4. Save changes