import * as React from "react";

import { TNewMemberSchema } from "@/components/NewMemberForm";

export const EmailTemplate: React.FC<Readonly<TNewMemberSchema>> = ({
  fullName,
  cellPhone,
  instagramUrl,
  // facebookUrl,
}) => {
  return (
    <div className="text-xl">
      <strong>Name:</strong> {fullName}
      <br />
      <strong>Number</strong>: {cellPhone}
      <br />
      <strong>Instagram/Facebook</strong>: {instagramUrl}
    </div>

    // <table
    //   style={{
    //     borderCollapse: "collapse",
    //     width: "100%",
    //   }}
    // >
    //   <thead>
    //     <tr>
    //       <th
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           backgroundColor: "#f2f2f2",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         Full Name
    //       </th>
    //       <th
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           backgroundColor: "#f2f2f2",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         Cell Phone
    //       </th>
    //       <th
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           backgroundColor: "#f2f2f2",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         Instagram URL
    //       </th>
    //       <th
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           backgroundColor: "#f2f2f2",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         Facebook URL
    //       </th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     <tr>
    //       <td
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         {fullName}
    //       </td>
    //       <td
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         {cellPhone}
    //       </td>
    //       <td
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         <a href={instagramUrl}>{instagramUrl}</a>
    //       </td>
    //       <td
    //         style={{
    //           padding: "8px",
    //           textAlign: "left",
    //           border: "1px solid #ddd",
    //         }}
    //       >
    //         <a href={instagramUrl}>{instagramUrl}</a>
    //       </td>
    //     </tr>
    //   </tbody>
    // </table>
  );
};
