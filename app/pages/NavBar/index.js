import { useTheme as useNextTheme } from "next-themes";
import { Navbar, Button, Text } from "@nextui-org/react";

const NavComponent = () => {
  return (
    <Navbar isBordered>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Portfolio
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs">
        <Navbar.Link href="#">Home</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <Button>Switch</Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default NavComponent;
