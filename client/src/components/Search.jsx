import {
  InputBase,
  IconButton,
  useTheme,
  Box,
  Typography,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [key, setKey] = useState("");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const search = async () => {
      try {
        if (!key.trim()) {
          setSearchResult([]);
          return;
        }
        const res = await fetch(
          "http://localhost:3001/users?" +
            new URLSearchParams({ keyword: key }),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSearchResult(await res.json());
      } catch (error) {
        console.log(error);
      }
    };
    search();
  }, [key]);

  const handleSearch = () => {
    setIsSearch(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <FlexBetween
        backgroundColor={neutralLight}
        borderRadius="9px"
        gap="4rem"
        padding="0.1rem 1rem"
      >
        <InputBase
          placeholder="Search..."
          onChange={(e) => setKey(e.target.value)}
          onClick={handleSearch}
        />
        <IconButton>
          <Search />
        </IconButton>
      </FlexBetween>

      {/* <MenuItem>
        <Search />
      </MenuItem> */}

      {isSearch && searchResult && searchResult.length > 0 && (
        <Box
          sx={{
            zIndex: 200,
            position: "absolute",
            top: "3rem",

            backgroundColor: "#181818",
            borderRadius: "9px",
            width: "100%",
            height: "max-content",
          }}
        >
          {searchResult.map((searchUser) => (
            <Box key={searchUser._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem 0.5rem",
                  text: "black",
                }}
              >
                <FlexBetween>
                  <UserImage
                    image={searchUser.picturePath}
                    size="20px"
                    sx={{ padding: "0.5rem 1rem" }}
                  />
                  <Typography
                    sx={{ padding: "0.1rem 0.5rem", fontSize: "14px" }}
                  >
                    {searchUser.firstName} {searchUser.lastName}
                  </Typography>
                </FlexBetween>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default SearchBox;
