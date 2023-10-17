package com.habsida.crudmvc.controller;

import com.habsida.crudmvc.entity.Role;
import com.habsida.crudmvc.entity.User;
import com.habsida.crudmvc.service.RoleService;
import com.habsida.crudmvc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.ArrayList;

@Controller
@RequestMapping("")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest request) {
        HttpSession httpSession = request.getSession();
        httpSession.invalidate();
        return "redirect:/login";
    }

    @GetMapping("/user")
    public String user(Principal principal, ModelMap model) {
        model.addAttribute("currentUser", userService.findByEmail(principal.getName()));
        return "user_index";
    }

    @GetMapping("/admin")
    public String admin(Principal principal, ModelMap model) {
        User currentUser = userService.findByEmail(principal.getName());
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("allRoles", roleService.listRoles());
        model.addAttribute("roles", new ArrayList<Role>());
        return "admin_index";
    }
}
