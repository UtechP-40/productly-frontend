# EnhancedPermissionMatrix Component

The `EnhancedPermissionMatrix` component provides a visual interface for permission assignment with drag-and-drop functionality, bulk operations, and conflict detection.

## Features

- **Drag-and-Drop Interface**: Easily assign permissions by dragging them to a drop zone
- **Bulk Operations**: Select multiple permissions and apply actions to all of them at once
- **Permission Conflict Detection**: Identify and resolve conflicts between roles
- **Visual Categorization**: Organize permissions by category for easier management
- **Responsive Design**: Works well on different screen sizes
- **Tooltips**: Provides additional information about permissions
- **Read-Only Mode**: Support for viewing permissions without editing capability

## Usage

### Basic Usage

```jsx
import { EnhancedPermissionMatrix } from '../components/dashboard/EnhancedPermissionMatrix';

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissionMatrix, setPermissionMatrix] = useState(null);
  
  // Handle permission change
  const handlePermissionChange = (permissionId, isChecked) => {
    // Update role permissions
  };
  
  // Handle bulk permission changes
  const handleBulkPermissionChange = (permissionIds, isChecked) => {
    // Update multiple permissions at once
  };
  
  return (
    <EnhancedPermissionMatrix
      selectedRole={selectedRole}
      permissionMatrix={permissionMatrix}
      onPermissionChange={handlePermissionChange}
      onBulkPermissionChange={handleBulkPermissionChange}
    />
  );
}
```

### With Conflict Detection

```jsx
import { EnhancedPermissionMatrix } from '../components/dashboard/EnhancedPermissionMatrix';

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissionMatrix, setPermissionMatrix] = useState(null);
  const [conflictingRoles, setConflictingRoles] = useState([]);
  
  // Fetch conflicting roles
  useEffect(() => {
    if (selectedRole) {
      fetchConflictingRoles(selectedRole._id);
    }
  }, [selectedRole]);
  
  const fetchConflictingRoles = async (roleId) => {
    try {
      const response = await fetch(`/api/roles/${roleId}/conflicts`);
      const data = await response.json();
      
      if (data.success) {
        setConflictingRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching conflicting roles:', error);
    }
  };
  
  return (
    <EnhancedPermissionMatrix
      selectedRole={selectedRole}
      permissionMatrix={permissionMatrix}
      onPermissionChange={handlePermissionChange}
      onBulkPermissionChange={handleBulkPermissionChange}
      conflictingRoles={conflictingRoles}
    />
  );
}
```

### Read-Only Mode

```jsx
import { EnhancedPermissionMatrix } from '../components/dashboard/EnhancedPermissionMatrix';

export default function ViewRole() {
  return (
    <EnhancedPermissionMatrix
      selectedRole={role}
      permissionMatrix={permissionMatrix}
      readOnly={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedRole` | Object | (required) | The currently selected role with permissions |
| `permissionMatrix` | Object | (required) | The permission matrix data structure |
| `onPermissionChange` | Function | (required) | Callback when a permission is toggled |
| `onBulkPermissionChange` | Function | - | Callback for bulk permission changes |
| `readOnly` | Boolean | `false` | Whether the matrix is in read-only mode |
| `loading` | Boolean | `false` | Whether the matrix is loading |
| `conflictingRoles` | Array | `[]` | Array of roles that have conflicting permissions |

## Permission Matrix Data Structure

The component expects the permission matrix data in the following format:

```javascript
{
  categories: ["user_management", "content", "settings"],
  permissions: {
    user_management: [
      { _id: "1", name: "users.view", description: "View users", isSystemPermission: false },
      { _id: "2", name: "users.create", description: "Create users", isSystemPermission: false }
    ],
    content: [
      { _id: "3", name: "content.view", description: "View content", isSystemPermission: false },
      { _id: "4", name: "content.edit", description: "Edit content", isSystemPermission: false }
    ],
    settings: [
      { _id: "5", name: "settings.view", description: "View settings", isSystemPermission: true },
      { _id: "6", name: "settings.edit", description: "Edit settings", isSystemPermission: true }
    ]
  }
}
```

## Role Data Structure

The component expects the role data in the following format:

```javascript
{
  _id: "role1",
  name: "Admin",
  description: "Administrator role",
  permissions: ["1", "2", "3", "4", "5", "6"], // Array of permission IDs
  isSystemRole: true
}
```

## Conflict Detection

The component can detect and display permission conflicts between roles. Conflicts are displayed as alerts with details about which permissions conflict with which roles.

## Bulk Operations

The component supports the following bulk operations:

- **Select All**: Select all permissions in the current category
- **Grant All**: Grant all selected permissions to the role
- **Revoke All**: Revoke all selected permissions from the role
- **Clear Selection**: Clear the current selection

## Drag and Drop

The component supports drag and drop functionality for assigning permissions:

1. Drag a permission from the list
2. Drop it in the drop zone at the top of the component
3. The permission will be assigned to the role if not already assigned