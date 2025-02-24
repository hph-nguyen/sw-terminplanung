/* eslint-disable no-unused-vars */
import { lazy, Suspense, useMemo, useState } from "react";
import { MaterialReactTable, createRow, useMaterialReactTable } from "material-react-table";
import { Box, Button, IconButton, Tooltip, darken, lighten } from "@mui/material";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fakeData, usStates } from "../dummyData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { redAccent } from "../theme";

const Example = () => {
  const [creatingRowIndex, setCreatingRowIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.firstName,
          helperText: validationErrors.firstName,
          onFocus: () => setValidationErrors({ ...validationErrors, firstName: undefined }),
        },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.lastName,
          helperText: validationErrors.lastName,
          onFocus: () => setValidationErrors({ ...validationErrors, lastName: undefined }),
        },
      },
      {
        accessorKey: "city",
        header: "City",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.city,
          helperText: validationErrors.city,
          onFocus: () => setValidationErrors({ ...validationErrors, city: undefined }),
        },
      },
      {
        accessorKey: "state",
        header: "State",
        editVariant: "select",
        editSelectOptions: usStates,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors.state,
          helperText: validationErrors.state,
        },
      },
    ],
    [validationErrors]
  );

  const { mutateAsync: createUser } = useCreateUser();
  const { data: fetchedUsers = [], isError: isLoadingUsersError, isFetching: isFetchingUsers } = useGetUsers();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleCreateUser = async ({ values, row, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some(Boolean)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser({ ...values, managerId: row.original.managerId });
    table.setCreatingRow(null);
  };

  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some(Boolean)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableColumnPinning: true,
    enableEditing: true,
    enableExpanding: true,
    positionCreatingRow: creatingRowIndex,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError ? { color: "error", children: "Error loading data" } : undefined,
    muiTableContainerProps: { sx: { minHeight: "500px" } },
    muiTableBodyRowProps: ({ row }) => ({
      sx: (theme) => ({
        td: {
          backgroundColor: "white",
        },
      }),
    }),
    muiTableHeadCellProps: {
      sx: {
        color: redAccent[500],
        backgroundColor: "white",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderRowActions: ({ row, staticRowIndex, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      console.info("create user", user);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
  });
}

function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

function useUpdateUser() {
  return useMutation({
    mutationFn: async (user) => {
      console.info("update user", user);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
  });
}

function useDeleteUser() {
  return useMutation({
    mutationFn: async (userId) => {
      console.info("delete user", userId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
  });
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <Suspense fallback={null}>
        <LazyReactQueryDevtools />
      </Suspense>
    </QueryClientProvider>
  );
}

const LazyReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then((d) => ({ default: d.ReactQueryDevtools }))
);

function validateUser(user) {
  return {
    firstName: !user.firstName ? "First Name is Required" : "",
    lastName: !user.lastName ? "Last Name is Required" : "",
  };
}

function findUserInTree(managerId, users) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === managerId) {
      return users[i];
    }
    if (users[i].subRows) {
      const found = findUserInTree(managerId, users[i].subRows);
      if (found) return found;
    }
  }
  return null;
}
