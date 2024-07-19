import { NextResponse } from 'next/server';
import { TNewMemberSchema } from '@/components/NewMemberForm';

import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';


const resend = new Resend(process.env.EMAIL_API_KEY);

export async function POST(request: Request) {
  const body: TNewMemberSchema = await request.json();

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['simonxmachine@gmail.com'],
      subject: 'New Kiwi Member Alert',
      react: EmailTemplate({ ...body }),
    });

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error });
  }
}