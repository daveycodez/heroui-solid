import {
  Autocomplete,
  Description,
  EmptyState,
  Label,
  ListBox,
  ListLayout,
  SearchField,
  useFilter,
  Virtualizer
} from "heroui-solid"
import { createMemo, createSignal } from "solid-js"

interface User {
  email: string
  id: number
  name: string
}

function generateUsers(n: number): User[] {
  const firstNames = [
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "James",
    "Sophia",
    "Oliver",
    "Isabella",
    "Lucas",
    "Mia",
    "Ethan",
    "Charlotte",
    "Mason",
    "Amelia",
    "Logan",
    "Harper",
    "Alexander",
    "Ella",
    "Benjamin"
  ]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Clark",
    "Lewis",
    "Robinson",
    "Walker"
  ]
  const users: User[] = []

  for (let i = 0; i < n; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName =
      lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const name = `${firstName} ${lastName}`

    users.push({
      email: `${firstName?.toLowerCase()}.${lastName?.toLowerCase()}@acme.com`,
      id: i + 1,
      name
    })
  }

  return users
}

export function Virtualization() {
  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)
  const [searchQuery, setSearchQuery] = createSignal("")
  const { contains } = useFilter({ sensitivity: "base" })

  const allUsers = generateUsers(1000)

  const filteredUsers = createMemo(() => {
    const query = searchQuery()

    if (!query) return allUsers

    return allUsers.filter(
      (user) => contains(user.name, query) || contains(user.email, query)
    )
  })

  return (
    <Autocomplete
      allowsEmptyCollection
      class="w-[300px]"
      placeholder="Select a user"
      selectionMode="single"
      value={selectedKey()}
      onChange={(key) => setSelectedKey(key as string | null)}
    >
      <Label>User</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter
          inputValue={searchQuery()}
          onInputChange={setSearchQuery}
        >
          <SearchField
            autoFocus
            class="sticky top-0 z-10"
            name="search"
            variant="secondary"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search users..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 50 }}>
            <ListBox
              items={filteredUsers()}
              renderEmptyState={() => <EmptyState>No results found</EmptyState>}
            >
              {(user: User) => (
                <ListBox.Item id={String(user.id)} textValue={user.name}>
                  <div class="flex flex-col">
                    <Label>{user.name}</Label>
                    <Description>{user.email}</Description>
                  </div>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </ListBox>
          </Virtualizer>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
