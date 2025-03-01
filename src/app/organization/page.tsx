"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Head from "next/head";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

interface Organization {
  name: string;
  mission: string;
  values: string[];
  link: string;
  logo: string;
}

const OrganizationCard: React.FC<{
  organization: Organization;
  onClick: () => void;
}> = ({ organization, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-gradient-to-br from-[#6e89a8] to-[#7a97b8] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    onClick={onClick}
  >
    <img
      src={organization.logo}
      alt={`${organization.name} logo`}
      className="rounded-lg mb-4 w-full"
    />
    <h2 className="text-xl font-semibold mb-2 text-gray-800">
      {organization.name}
    </h2>
    <p className="text-gray-600 mb-4 h-20 overflow-y-auto">
      {organization.mission}
    </p>
    <Link
      href={`https://github.com/${organization.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      Learn more
    </Link>
  </motion.div>
);

const OrganizationPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organization");
        if (!response.ok) {
          throw new Error("GitHub organizations not found");
        }
        const data = await response.json();
        setOrganizations(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchOrganizations();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (organizations.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>My Organizations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-cyan-200 text-center"
        >
          My Organizations
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((organization, index) => (
            <OrganizationCard
              key={index}
              organization={organization}
              onClick={() => setSelectedOrganization(organization)}
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedOrganization && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
              onClick={() => setSelectedOrganization(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-8 max-w-md w-full relative"
              >
                <button
                  onClick={() => setSelectedOrganization(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                  <FaTimes size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedOrganization.name}
                </h2>
                <p className="text-gray-700 mb-4">
                  {selectedOrganization.mission}
                </p>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Values</h3>
                  {selectedOrganization.values &&
                  selectedOrganization.values.length > 0 ? (
                    selectedOrganization.values.map((value, index) => (
                      <p key={index} className="text-gray-600">
                        {value}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">No values available</p>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <Link
                    href={`https://github.com/${selectedOrganization.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    View on GitHub
                  </Link>
                  <button
                    onClick={() => setSelectedOrganization(null)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default OrganizationPage;
