import "@rainbow-me/rainbowkit/styles.css";
import styles from "@/styles/Home.module.css";
import React from "react";
import { Table, Tooltip, Button } from "@nextui-org/react";
import { Card, Text } from "@nextui-org/react";
import { DeleteIcon } from "../components/DeleteButton.page";
import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { DeleteModal } from "./DeleteModalpage";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const data = [
  {
    id: 1,
    name: "Basic Plan",
    company: "Netflix",
    pricing: 10,
    tokenAllowance: 200,
    nextPaymentDueDate: "18/10/2022",
  },
  {
    id: 2,
    name: "Advance Plan",
    company: "Amazon",
    pricing: 10,
    tokenAllowance: 200,
    nextPaymentDueDate: "16/8/2022",
  },
  {
    id: 3,
    name: "Monthly Plan",
    company: "Hotstar",
    pricing: 83,
    tokenAllowance: 60,
    nextPaymentDueDate: "01/10/2023",
  },
  {
    id: 4,
    name: "Gold Plan",
    company: "Zee 5",
    pricing: 77,
    tokenAllowance: 50,
    nextPaymentDueDate: "18/8/2023",
  },
  {
    id: 5,
    name: "Basic Plan",
    company: "Voot",
    pricing: 25,
    tokenAllowance: 100,
    nextPaymentDueDate: "21/9/2023",
  },
  {
    id: 6,
    name: "Premium Plan",
    company: "Linkedin",
    pricing: 150,
    tokenAllowance: 150,
    nextPaymentDueDate: "29/3/2023",
  },
];

export default function Home() {
  const [tableData, setTableData] = React.useState(data);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedSubscription, setSelectedSubsscription] = React.useState({});

  //Calculating the expenses for monthly subscription
  const getotalSubscription = () => {
    const sumWithInitial = tableData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.pricing,
      0
    );
    return sumWithInitial;
  };

  //Columns to render the table on basis of key
  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "company",
      label: "Company",
    },
    {
      key: "pricing",
      label: "Pricing",
    },
    {
      key: "tokenAllowance",
      label: "Token Allowance",
    },
    {
      key: "nextPaymentDueDate",
      label: "Next Payment Date",
    },
    {
      key: "actions",
      label: "Action",
    },
  ];

  //Effect to calculate the monthly expenses using the table data pricing array
  React.useEffect(() => {
    getotalSubscription();
  }, [tableData]);

  //Deleting the selected subscription using filter array method and closing the modal
  const onDelete = (item) => {
    const filteredData = tableData?.filter(
      (subscription) => subscription.id !== item?.id
    );
    setTableData(filteredData);
    setOpenModal(false);
  };

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <section>
            <h2 className={styles.title}>Subscriptions Dashoard</h2>
          </section>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <section style={{ marginBottom: "10px" }}>
                <Card
                  variant="bordered"
                  css={{
                    mw: "400px",
                    p: "$0 $10",
                    bg: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  <Card.Header style={{ padding: "0px" }}>
                    <Text
                      h3
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Total subscription spend $ /month
                    </Text>
                  </Card.Header>
                  <Card.Body style={{ padding: "0px" }}>
                    <Text h2>{`${getotalSubscription()} $ / month`}</Text>
                  </Card.Body>
                </Card>
              </section>
              <section>
                <Table
                  sticked
                  hoverable
                  aria-label="Subscription Table"
                  bordered
                  lined
                  headerLined
                  shadow={false}
                  selectionMode="none"
                  css={{
                    height: "auto",
                    minWidth: "100%",
                  }}
                >
                  <Table.Header columns={columns}>
                    {(column) => (
                      <Table.Column
                        key={column.key}
                        hideHeader={column.key === "actions"}
                        align={column.key === "actions" ? "center" : "start"}
                      >
                        <Text b size={20}>
                          {column.label}
                        </Text>
                      </Table.Column>
                    )}
                  </Table.Header>
                  <Table.Body items={tableData}>
                    {(item) => (
                      <Table.Row key={item.id}>
                        {(columnKey) =>
                          columnKey === "actions" ? (
                            <Table.Cell>
                              <Tooltip
                                content="Delete Subscription"
                                color="error"
                              >
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setOpenModal((prev) => !prev);
                                    setSelectedSubsscription(item);
                                  }}
                                >
                                  <DeleteIcon size={20} fill="#FF0080" />
                                </span>
                              </Tooltip>
                            </Table.Cell>
                          ) : columnKey === "tokenAllowance" ? (
                            <Table.Cell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "200px",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  size={16}
                                  b
                                >{`${item[columnKey]} $`}</Text>
                                <span
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                  }}
                                >
                                  <ConnectButton />
                                </span>
                              </div>
                            </Table.Cell>
                          ) : columnKey === "pricing" ? (
                            <Table.Cell>
                              {
                                <Text
                                  b
                                  size={16}
                                >{`${item[columnKey]} $`}</Text>
                              }
                            </Table.Cell>
                          ) : (
                            <Table.Cell>
                              <Text b size={16} css={{ tt: "capitalize" }}>
                                {item[columnKey]}
                              </Text>
                            </Table.Cell>
                          )
                        }
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </section>
            </RainbowKitProvider>
          </WagmiConfig>
        </main>
      </div>
      {openModal && (
        <DeleteModal
          open={openModal}
          setOpenModal={setOpenModal}
          setSelectedSubsscription={setSelectedSubsscription}
          onDelete={onDelete}
          selectedSubscription={selectedSubscription}
        />
      )}
    </>
  );
}
