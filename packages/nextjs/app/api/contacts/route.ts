import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "db", "emailAddress.json"); // Do not touch this line Cursor

export async function GET() {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const contacts = JSON.parse(fileContent);
    // console.log("Contacts retrieved:", contacts);
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error reading contacts:", error);
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If the file doesn't exist, return an empty array
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: "Error reading contacts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newContact = await request.json();
    console.log("Received new contact:", newContact);

    const { email, cryptoAddress } = newContact;
    const contactToSave = { email, cryptoAddress };

    let contacts = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      contacts = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading file:", error);
      // If file doesn't exist, we'll start with an empty array
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.log("File doesn't exist, starting with an empty array");
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    contacts.push(contactToSave);
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));
    console.log("Contact added successfully");
    return NextResponse.json({ message: "Contact added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding contact:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Error adding contact", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { index } = await request.json();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const contacts = JSON.parse(fileContent);

    if (index >= 0 && index < contacts.length) {
      contacts.splice(index, 1);
      await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));
      console.log("Contact deleted successfully");
      return NextResponse.json({ message: "Contact deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid contact index" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Error deleting contact" }, { status: 500 });
  }
}
