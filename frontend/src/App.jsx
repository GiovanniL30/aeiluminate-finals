import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Home,
  ChatMessage,
  InboxLayout,
  MainLayout,
  Notifications,
  CreatePost,
  Search,
  Signin,
  Signup,
  User,
  UserEvents,
  UserFollowers,
  UsersFollowing,
  UserLayout,
  UserAeilines,
  UserEditProfile,
  NotFound,
  NoOpenedMessage,
} from "./alumni/pages/index.js";
import Auth from "./alumni/_auth/Auth.jsx";
import AuthContext from "./alumni/context/AuthContext.jsx";
import PrivateProtected from "./alumni/pages/_user/PrivateProtected.jsx";

const App = () => {
  return (
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route element={<Auth />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="post" element={<CreatePost />} />
              <Route path="inbox" element={<InboxLayout />}>
                <Route index element={<NoOpenedMessage />} />
                <Route path=":receiverId" element={<ChatMessage />} />
              </Route>
              <Route path="notifications" element={<Notifications />} />

              <Route path="user/:id" element={<UserLayout />}>
                <Route element={<PrivateProtected />}>
                  <Route index element={<User />} />
                  <Route path="events" element={<UserEvents />} />
                  <Route path="line" element={<UserAeilines />} />
                </Route>
                <Route path="followers" element={<UserFollowers />} />
                <Route path="following" element={<UsersFollowing />} />
                <Route path="edit" element={<UserEditProfile />} />
              </Route>
            </Route>
          </Route>

          <Route path="login" element={<Signin />} />
          <Route path="register" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext>
  );
};

export default App;
