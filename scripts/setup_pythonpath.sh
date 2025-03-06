#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Function to add path to PYTHONPATH in shell rc file
add_to_shell_rc() {
    local shell_rc="$1"
    local pythonpath_entry="export PYTHONPATH=\"$PROJECT_ROOT:\$PYTHONPATH\""
    
    # Check if the entry already exists
    if ! grep -q "export PYTHONPATH=.*$PROJECT_ROOT" "$shell_rc"; then
        echo "" >> "$shell_rc"
        echo "# Added by setup_pythonpath.sh" >> "$shell_rc"
        echo "$pythonpath_entry" >> "$shell_rc"
        echo "Added PYTHONPATH entry to $shell_rc"
    else
        echo "PYTHONPATH entry already exists in $shell_rc"
    fi
}

# Detect shell and update appropriate rc file
case "$SHELL" in
    */zsh)
        RC_FILE="$HOME/.zshrc"
        ;;
    */bash)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            RC_FILE="$HOME/.bash_profile"
        else
            RC_FILE="$HOME/.bashrc"
        fi
        ;;
    *)
        echo "Unsupported shell: $SHELL"
        exit 1
        ;;
esac

# Add to shell rc file
if [ -f "$RC_FILE" ]; then
    add_to_shell_rc "$RC_FILE"
else
    echo "Creating $RC_FILE"
    touch "$RC_FILE"
    add_to_shell_rc "$RC_FILE"
fi

# Also add to current session
export PYTHONPATH="$PROJECT_ROOT:$PYTHONPATH"

echo "Project root ($PROJECT_ROOT) has been added to PYTHONPATH"
echo "Please restart your shell or run 'source $RC_FILE' to apply changes" 