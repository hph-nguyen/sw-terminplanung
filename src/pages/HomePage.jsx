/* eslint-disable no-unused-vars */
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import OhmLogo from "../assets/OhmLogo.png";
import { Button } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Benutzerverwaltung from "../components/Benutzerverwaltung/Benutzerverwaltung";
import Terminplanung from "../components/Terminplanung/Terminplanung";
import Modulverwaltung from "../components/Modulverwaltung/Modulverwaltung";
import { useEffect, useState } from "react";
import { AccountCircle, EventAvailable, VpnKey } from "@mui/icons-material";
import Zugangscode from "../components/Zugangscode/Zugangscode";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { redAccent } from "../theme";
import GeplanteTermine from "../components/GeplanteTermine/GeplanteTermine";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const menuItems = [
  { item: "Modulverwaltung", icon: <BookIcon />, component: <Modulverwaltung /> },
  { item: "Terminplanung", icon: <CalendarMonthIcon />, component: <Terminplanung /> },
  { item: "Geplante Termine", icon: <EventAvailable />, component: <GeplanteTermine /> },
  { item: "Benutzerverwaltung", icon: <GroupIcon />, component: <Benutzerverwaltung /> },
  { item: "Zugangscode", icon: <VpnKey />, component: <Zugangscode /> },
];

export default function HomePage() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [openLogOutConfirm, setOpenLogOutConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(() => sessionStorage.getItem("currentTab") || "Modulverwaltung");
  const { logout } = useAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const storedTab = sessionStorage.getItem("currentTab");
    if (storedTab) {
      const foundItem = menuItems.find((item) => item.item === storedTab);
      if (foundItem) {
        setSelectedComponent(foundItem.component);
      }
    }
  }, []);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleItemClick = (component, currentItem) => {
    setSelectedComponent(component);
    setSelectedItem(currentItem);
    sessionStorage.setItem("currentTab", currentItem);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open} elevation={0} sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{ maxHeight: { xs: "16vh" }, maxWidth: { xs: "16vh" } }}
            alt="OhmLogo"
            src={OhmLogo}
          />
          <Box sx={{ ml: "auto" }}>
            <Button variant="outlined" onClick={() => setOpenLogOutConfirm(true)}>
              <AccountCircle sx={{ mr: 1 }} />
              Abmelden
            </Button>
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} color="primary">
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((itemData, index) => (
            <ListItem key={itemData.item} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={selectedItem === itemData.item}
                onClick={() => handleItemClick(itemData.component, itemData.item)}
                sx={[{ minHeight: 48, px: 2.5 }, open ? { justifyContent: "initial" } : { justifyContent: "center" }]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                      color: selectedItem === itemData.item ? redAccent[500] : "",
                    },
                    open ? { mr: 2 } : { mr: "auto" },
                  ]}
                >
                  {itemData.icon}
                </ListItemIcon>
                <ListItemText primary={itemData.item} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2.5,
          display: "grid",
          gridTemplateColumns: "1fr",
          minWidth: 0,
          overflowX: "auto",
        }}
      >
        <DrawerHeader />
        {/* <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            minWidth: 0,
            overflowX: "auto",
          }}
        > */}
        {selectedComponent ? selectedComponent : <Modulverwaltung />}
        {/* </Box> */}
      </Box>
      <ConfirmDialog
        msg={"Sind Sie sicher, dass Sie ausloggen möchten?"}
        open={openLogOutConfirm}
        onClose={() => setOpenLogOutConfirm(false)}
        onDecline={() => setOpenLogOutConfirm(false)}
        onConfirm={() => {
          setOpenLogOutConfirm(false);
          sessionStorage.clear();
          logout();
        }}
      ></ConfirmDialog>
    </Box>
  );
}
