-- Database schema for ChadWallet Trade Feed & User Profiles

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create trade feed table
CREATE TABLE IF NOT EXISTS public.trade_feed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('buy', 'sell')) NOT NULL,
    token_symbol TEXT NOT NULL,
    token_mint TEXT NOT NULL,
    usd_value NUMERIC NOT NULL,
    thesis TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on trade_feed
ALTER TABLE public.trade_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to trade_feed" ON public.trade_feed
    FOR SELECT USING (true);

CREATE POLICY "Allow users to post their trades" ON public.trade_feed
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Setup automatic profile creation on user signup (Supabase Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', 'degen_' || substring(new.id::text from 1 for 8)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', '🔋')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
