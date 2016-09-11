# paper-fab-menu

Material design: [Floating Action Button](https://www.google.com/design/spec/components/buttons-floating-action-button.html)

A floating action button represents the primary action in an application.

Use the `<paper-fab-menu>` to display menu-like fab buttons and to promote actions.

### Example

    <paper-fab-menu color="teal" icon="add" position="vertical">
      <paper-fab-menu-item color="teal" tooltip="Favorites" icon="star" ></paper-fab-menu-item>
      <paper-fab-menu-item color="teal" tooltip="Favorites" icon="star" ></paper-fab-menu-item>
      <paper-fab-menu-item color="teal" tooltip="Favorites" icon="star" ></paper-fab-menu-item>
    </paper-fab-menu>

### Icons
Import your `iron-icons` library and use icons you like.

    <link rel="import" href="bower_components/iron-icons/iron-icons.html">
    <paper-fab-menu icon="add"></paper-fab-menu>

### Styling
Style the menu using `<paper-fab>` variables and mixins.

# paper-fab-menu-item

The `<paper-fab-menu-item>` is a menu item that can be used with `<paper-fab-menu>`.
It renders as a mini fab button but it's hidden. The `<paper-fab-menu>` triggers menu items when hovered.

See `<paper-fab-menu>` for more information and demos.

