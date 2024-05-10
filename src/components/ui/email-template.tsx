import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  state: string;
  city: string;
  address: string;
  phoneNumber: string;
  refName: string;
  refPhoneNumber: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name, email, state, city, address, phoneNumber, refName, refPhoneNumber
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <div style={{ width: '100%', maxWidth: '750px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', fontSize: '33px', color: '#333', marginBottom: '40px' }}>New contact arrived</div>
        <div style={{ backgroundColor: '#F3EBDD', borderRadius: '20px', width: '100%', padding: '20px' }}>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>Name: {name}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>Email: {email}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>State: {state}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>City: {city}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>Address: {address}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>Phone Number: {phoneNumber}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>Referral Name: {refName}</div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '5px', marginBottom: '5px' }}>Referral PhoneNumber: {refPhoneNumber}</div>
        </div>
        <div style={{ padding: '35px 0px', width: '100%' }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ fontSize: '14px', color: '#BC9067', textAlign: 'center' }}>This is a newsletter from the Kiwi Farm.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);