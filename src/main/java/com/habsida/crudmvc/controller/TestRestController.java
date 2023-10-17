package com.habsida.crudmvc.controller;

import com.habsida.crudmvc.entity.User;
import com.habsida.crudmvc.service.RoleService;
import com.habsida.crudmvc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TestRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @GetMapping("/admin/users")
    public List<User> listUsers() {
        return userService.listUsers();
    }

    @GetMapping("/admin/users/{id}")
    public User listUser(@PathVariable long id) {
        return userService.getUser(id);
    }

    @GetMapping("/user/{id}")
    public User listMainUser(@PathVariable long id) {
        return userService.getUser(id);
    }

    @PostMapping(value = "/admin/users", consumes = {"application/json"})
    @ResponseStatus(HttpStatus.CREATED)
    public void createUser(@RequestBody User user){
        userService.saveUser(user);
    }

    @PutMapping(value = "/admin/users/{id}", consumes = {"application/json"})
    public void updateUser(@RequestBody User user) {
        userService.updateUser(user);
    }

    @DeleteMapping(value = "/admin/users/{id}")
    public void deleteUser(@PathVariable long id) {
        userService.deleteById(id);
    }
}
