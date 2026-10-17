import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  PlusCircle,
  LogOut,
  PersonStanding,
  ArrowRightIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex flex-row justify-between items-center px-12 gap-x-4 h-16 bg-background text-gray-500 border border-b-gray-200 min-w-screen max-w-available">
      <a href="/" className="flex gap-2 items-center text-lg color-foreground">
        <img
          src="https://presencial.ifrs.edu.br/pluginfile.php/1/theme_academi/logo/1777587855/Logo-IFRS-cores-fundo-branco-Horizontal%20%281%29.jpg"
          alt="Logo do IFRS Campus Bento Gonçalves"
          className="md:w-40 w-48 transition ease-in-out duration-300 cursor-pointer"
        />
      </a>
      <nav className="flex items-center gap-4">
        {user && (
          <>
            {user.role === "admin" && (
              <Button asChild variant="ghost" size="lg" className="gap-2">
                <a href="/voluntarios" className="flex items-center gap-1">
                  <PersonStanding className="h-4 w-4" />
                  <span>Voluntários</span>
                </a>
              </Button>
            )}

            <Button asChild variant="ghost" size="lg" className="gap-2">
              <a href="/eventos" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Eventos</span>
              </a>
            </Button>

            {user.role === "admin" && (
              <Button
                asChild
                size="lg"
                className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white flex rounded-full"
              >
                <a href="/eventos/novo" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Novo Evento</span>
                </a>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {(user.name || user.email).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-30 truncate text-xs font-medium sm:max-w-none">
                  {user.email}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuItem render={<Link to="/perfil" />}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <p className="text-xs text-muted-foreground capitalize">
                      Permissão:{" "}
                      <span className="font-semibold text-emerald-700">
                        {user.role}
                      </span>
                    </p>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair da conta</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {!user && (
          <div className="flex gap-2 items-center">
            <Button asChild size="lg" variant="ghost">
              <Link to="/cadastro">Criar conta</Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              <Link to="/login" className="flex items-center gap-1">
                Entrar
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
