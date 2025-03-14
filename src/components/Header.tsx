import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

interface Props {
    currentPath: string
    data: {
        title: string;
        description: string;
    }[];
}

export default function Header(props: Props) {
    console.log(props.currentPath)
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger><a href={"/products"}>Item One</a></NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger><a href={"/products/astro-handbook"}>Item Two</a></NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link 2</NavigationMenuLink>
                        <NavigationMenuLink>Link 3</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}


