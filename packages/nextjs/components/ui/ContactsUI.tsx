import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

interface Contact {
  email: string;
  cryptoAddress: string;
}

interface ContactsUIProps {
  onContactSelected: (email: string, cryptoAddress: string) => void;
}

export const ContactsUI: React.FC<ContactsUIProps> = ({ onContactSelected }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({ email: "", cryptoAddress: "" });
  const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { address } = useAccount();

  const addModalRef = useRef<HTMLDivElement>(null);
  const optionsModalRef = useRef<HTMLDivElement>(null);

  const loadContacts = React.useCallback(async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("Contacts loaded:", data);
      // console.log("Current address:", address);

      // Filter out the contact with the same address as the current user
      const filteredContacts = Array.isArray(data)
        ? data.filter(contact => contact.cryptoAddress.toLowerCase() !== address?.toLowerCase())
        : [];

      // console.log("Filtered contacts:", filteredContacts);
      setContacts(filteredContacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setContacts([]);
    }
  }, [address]);

  useEffect(() => {
    loadContacts();

    const handleClickOutside = (event: MouseEvent) => {
      if (isAddModalOpen && addModalRef.current && !addModalRef.current.contains(event.target as Node)) {
        closeAddModal();
      }
      if (
        selectedContactIndex !== null &&
        optionsModalRef.current &&
        !optionsModalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddModalOpen, selectedContactIndex, loadContacts, address]);

  const handleAddContact = async () => {
    setValidationError(null);
    setEmailError(null);

    if (!newContact.email.trim() || !newContact.cryptoAddress.trim()) {
      setValidationError("Both email and crypto address are required.");
      return;
    }

    if (!validateEmail(newContact.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      console.log("Attempting to add contact:", newContact);
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("Contact added successfully:", result);

      setIsAddModalOpen(false);
      setNewContact({ email: "", cryptoAddress: "" });
      await loadContacts();
    } catch (error) {
      console.error("Error adding contact:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        setValidationError(`Failed to add contact: ${error.message}`);
      }
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setValidationError(null);
    setEmailError(null);
    setNewContact({ email: "", cryptoAddress: "" });
  };

  const handleContactClick = (contact: Contact, index: number) => {
    setSelectedContactIndex(index);
  };

  const handleSendToContact = () => {
    if (selectedContactIndex !== null) {
      const contact = contacts[selectedContactIndex];
      onContactSelected(contact.email, contact.cryptoAddress);
      setSelectedContactIndex(null);
    }
  };

  const handleDeleteContact = async () => {
    if (selectedContactIndex !== null) {
      try {
        const response = await fetch("/api/contacts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index: selectedContactIndex }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await loadContacts();
        setSelectedContactIndex(null);
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Failed to delete contact");
      }
    }
  };

  const handleNewContactChange = (field: keyof Contact, value: string) => {
    setNewContact(prev => ({ ...prev, [field]: value }));
    if (field === "email") {
      setEmailError(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContactIndex(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <div className="w-80 bg-base-100 p-4 rounded-lg shadow-lg border border-primary">
        <h2 className="text-xl font-bold mb-4 text-primary">Contacts</h2>
        <ul className="mb-4">
          {Array.isArray(contacts) && contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <li
                key={index}
                className="text-base-content mb-2 cursor-pointer bg-base-200 hover:bg-primary hover:text-primary-content p-3 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                onClick={() => handleContactClick(contact, index)}
              >
                <span className="font-medium">{contact.email}</span>
              </li>
            ))
          ) : (
            <li className="text-base-content mb-2">No contacts available</li>
          )}
        </ul>
        <button
          className="w-full bg-primary text-primary-content py-2 rounded hover:bg-primary-focus transition-colors duration-200"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Contact
        </button>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div ref={addModalRef} className="bg-base-100 p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-neutral">Add New Contact</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded bg-base-200 text-neutral mb-2"
              value={newContact.email}
              onChange={e => handleNewContactChange("email", e.target.value)}
            />
            <input
              type="text"
              placeholder="Crypto Address"
              className="w-full p-2 border rounded bg-base-200 text-neutral mb-2"
              value={newContact.cryptoAddress}
              onChange={e => handleNewContactChange("cryptoAddress", e.target.value)}
            />
            <div className="h-8 mb-4">
              {(validationError || emailError) && <p className="text-error text-sm">{validationError || emailError}</p>}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-accent text-accent-content py-2 px-4 rounded hover:opacity-80 mr-2"
                onClick={handleAddContact}
              >
                Submit
              </button>
              <button
                className="bg-error text-error-content py-2 px-4 rounded hover:opacity-80"
                onClick={closeAddModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedContactIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={optionsModalRef} className="bg-base-100 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Contact Options</h2>
            <div className="mb-6">
              <p className="text-center text-lg p-2 bg-base-200 rounded-lg">{contacts[selectedContactIndex].email}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                className="bg-accent hover:bg-accent-focus text-accent-content py-3 px-6 rounded-lg transition-colors duration-200 ease-in-out transform hover:-translate-y-0.5"
                onClick={handleSendToContact}
              >
                Choose
              </button>
              <button
                className="bg-error hover:bg-error-focus text-error-content py-3 px-6 rounded-lg transition-colors duration-200 ease-in-out transform hover:-translate-y-0.5"
                onClick={handleDeleteContact}
              >
                Delete
              </button>
              <button
                className="bg-neutral hover:bg-neutral-focus text-neutral-content py-3 px-6 rounded-lg transition-colors duration-200 ease-in-out transform hover:-translate-y-0.5"
                onClick={() => handleCloseModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
