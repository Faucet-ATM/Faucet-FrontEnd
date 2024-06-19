"use client";

import { useState, useTransition } from "react";

import { Button } from "@nextui-org/button";
import { CheckIcon } from "@/components/icons";
import { Chip } from "@nextui-org/chip";
import { CryptoCurrency } from "@prisma/client";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { requestToken } from "@/actions/request-token";
import { toast } from "react-toastify";

type FormFaucetProps = {
  cryptoCurrency: CryptoCurrency;
  name: string;
  network: string;
};

type Transaction = {
  tx_id: string;
  success: boolean;
  explorer_url: string;
};

const FormFaucet: React.FC<FormFaucetProps> = ({
  cryptoCurrency,
  name,
  network,
}) => {
  const [address, setAddress] = useState("");
  const [isPending, startTransition] = useTransition();
  const [transaction, setTransaction] = useState<Transaction>();

  const handleAction = async () => {
    try {
      const res = await requestToken({ name, network, address });
      if (!res.success) {
        toast.error(res.message);
      } else {
        setTransaction(res);
      }
    } catch (error) {
      toast.error("An error occurred while requesting the token.");
    }
  };

  const onButtonClick = (event: any) => {
    event.preventDefault(); // 防止表单提交刷新页面
    startTransition(() => {
      handleAction();
    });
  };

  return (
    <>
      <form className="grid gap-4 mt-4" onSubmit={onButtonClick}>
        <Input
          value={address}
          variant="bordered"
          placeholder="Wallet Address"
          onValueChange={setAddress}
        />
        <div className="m-w-full flex justify-center">
          <Button
            variant="shadow"
            color="success"
            type="submit"
            isLoading={isPending}
          >
            Request{" "}
            {
              // cryptoCurrency.claimAmount
              0.001
            }{" "}
            {cryptoCurrency.currencyCode}
          </Button>
        </div>
      </form>
      <div className="flex justify-center my-4">
        {transaction?.success && (
          <Chip
            startContent={<CheckIcon size={30} />}
            variant="flat"
            color="success"
            classNames={{
              base: "rounded-md h-auto p-2 m-auto w-full",
            }}
          >
            <p className="text-lg font-bold">Success!</p>
            <div className="flex flex-col gap-2">
              <p className="max-w-[50vw] break-words">
                Tx: {transaction?.tx_id}
              </p>
              <Button
                href={transaction?.explorer_url}
                as={Link}
                target="_blank"
                isExternal
                showAnchorIcon
                variant="flat"
                className="flex-none"
              >
                Explorer Url
              </Button>
            </div>
          </Chip>
        )}
      </div>
    </>
  );
};

export default FormFaucet;
