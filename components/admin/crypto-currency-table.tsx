"use client";

import { DeleteIcon, EditIcon, NotificationIcon } from "../icons";
import React, { useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/table";
import {
  addCryptoCurrency,
  deleteCryptoById,
  getCryptoCurrencyPage,
  updateCryptoCurrency,
} from "@/actions/crypto-currency";

import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import CryptoCurrencyModal from "./crypto-currency-modal";
import { CryptoCurrencySchema } from "@/schemas";
import { Pagination } from "@nextui-org/pagination";
import { useDisclosure } from "@nextui-org/modal";
import { z } from "zod";

export enum OperatorEnum {
  "ADD" = "add_crypto_currency",
  "EDIT" = "edit_crypto_currency",
  "DELETE" = "delete_crypto_currency",
}

export default function App() {
  const [pagination, setPagination] = React.useState({
    size: 20,
    current: 1,
    total: 0,
    pages: 1,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<z.infer<
    typeof CryptoCurrencySchema
  > | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tableData, setTableData] = useState([]);
  const [operatorType, setOperatorType] = useState(OperatorEnum["ADD"]);

  const fetchTableData = async (current: number) => {
    try {
      const response = await getCryptoCurrencyPage({
        size: pagination.size,
        current,
      });
      if (response.error) {
        setError(response.error);
      } else {
        const { records, ...pageParams }: any = response?.data ?? null;
        setTableData(records ?? []);
        setPagination(pageParams);
      }
    } catch (error) {
      console.error("Failed to fetch table data", error);
      setError("Failed to fetch table data");
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchTableData(pagination.current);
    });
  }, [pagination.current]);

  const handleOpenModal = (item: z.infer<typeof CryptoCurrencySchema>) => {
    setError("");
    setSuccess("");
    setSelectedItem(item);
    onOpen();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setOperatorType(OperatorEnum["ADD"]);
    onClose();
  };

  const onSubmit = (values: z.infer<typeof CryptoCurrencySchema>) => {
    if (selectedItem && operatorType === OperatorEnum["DELETE"]) {
      startTransition(() => {
        if (!selectedItem.id) return;
        deleteCryptoById((selectedItem as any)?.id)
          .then((res) => {
            if (res.error) {
              setError(res.error);
            } else {
              setSuccess(res.success ?? "");
              handleClose();
              startTransition(() => {
                fetchTableData(pagination.current); // Refresh table data
              });
            }
          })
          .catch(() => setError("Something went wrong"));
      });
    } else if (selectedItem && operatorType === OperatorEnum["EDIT"]) {
      startTransition(() => {
        if (!selectedItem.id) return;
        updateCryptoCurrency(values, (selectedItem as any)?.id)
          .then((res) => {
            if (res.error) {
              setError(res.error);
            } else {
              setSuccess(res.success ?? "");
              handleClose();
              startTransition(() => {
                fetchTableData(pagination.current); // Refresh table data
              });
            }
          })
          .catch(() => setError("Something went wrong"));
      });
    } else {
      startTransition(() => {
        addCryptoCurrency(values)
          .then((res) => {
            if (res.error) {
              setError(res.error);
            } else {
              setSuccess(res.success ?? "");
              handleClose();
              startTransition(() => {
                fetchTableData(pagination.current); // Refresh table data
              });
            }
          })
          .catch(() => setError("Something went wrong"));
      });
    }
  };

  return (
    <>
      <CryptoCurrencyModal
        isOpen={isOpen}
        onClose={handleClose}
        selectedItem={selectedItem}
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
        operatorType={operatorType}
      />
      <div className="flex justify-center min-h-[30px]">
        {error && (
          <Chip
            startContent={<NotificationIcon size={18} />}
            variant="flat"
            color="danger"
            classNames={{
              base: "rounded-md p-2 whitespace-pre-wrap h-auto",
            }}
          >
            {error}
          </Chip>
        )}
      </div>
      <div className="flex justify-center min-h-[30px]">
        {success && (
          <Chip
            startContent={<NotificationIcon size={18} />}
            variant="flat"
            color="success"
            classNames={{
              base: "rounded-md p-2 whitespace-pre-wrap h-auto",
            }}
          >
            {success}
          </Chip>
        )}
      </div>
      <Button
        className="mb-5"
        color="secondary"
        variant="solid"
        onPress={onOpen}
      >
        Add
      </Button>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={pagination.current}
              total={pagination.pages}
              onChange={(page: number) =>
                setPagination({ ...pagination, current: page })
              }
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">NAME</TableColumn>
          <TableColumn key="description">Description</TableColumn>
          <TableColumn key="network">Network</TableColumn>
          <TableColumn key="currencyCode">Currency Code</TableColumn>
          <TableColumn key="claimAmount">Claim Amount</TableColumn>
          <TableColumn key="claimFrequency">Claim Frequency</TableColumn>
          <TableColumn key="actions" align={"center"}>
            ACTIONS
          </TableColumn>
        </TableHeader>
        <TableBody isLoading={isPending} items={tableData}>
          {(item: z.infer<typeof CryptoCurrencySchema>) => (
            <TableRow key={item.name}>
              {(columnKey) => {
                return columnKey === "actions" ? (
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        variant="light"
                        aria-label="Edit"
                        size="sm"
                        onClick={() => {
                          setOperatorType(OperatorEnum["EDIT"]);
                          handleOpenModal(item);
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        aria-label="Delete"
                        size="sm"
                        onClick={() => {
                          setOperatorType(OperatorEnum["DELETE"]);
                          handleOpenModal(item);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </TableCell>
                ) : (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
