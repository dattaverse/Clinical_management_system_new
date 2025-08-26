/*
  # Disable Email Confirmation

  This migration documents the manual steps needed to disable email confirmation in Supabase.
  
  ## Manual Steps Required in Supabase Dashboard:
  
  1. Go to Authentication > Settings
  2. Under "Email Auth" section
  3. Turn OFF "Enable email confirmations"
  4. Save changes
  
  ## What this enables:
  - Users can login immediately after signup
  - No email confirmation required
  - Streamlined authentication flow
*/

-- This is a documentation-only migration
-- The actual setting must be changed in Supabase Dashboard
SELECT 'Email confirmation will be disabled via Dashboard settings' as note;