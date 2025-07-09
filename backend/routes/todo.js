import express from "express";


const router = express.Router();

//Add the routes here...
router.get('/', async (req, res) => {
    // Gets all the todos from the database
    const todos = await prisma.todo.findMany();
    // Responds back to the client with json with a success status and the todos array
    res.status(200).json({
        success: true,
        todos,
    });
});

// Define a POST route for creating a new todo
router.post('/', async (req, res) => {
    // Destructure `name` and `description` from the request body
    const { name, description } = req.body;
    try {
        // Use Prisma to create a new todo entry in the database
        const newTodo = await prisma.todo.create({
            data: {
                name,               // Set the name of the todo from the request
                description,        // Set the description of the todo from the request
                completed: false,   // Default value for `completed` is set to false
                userId: req.user.sub, // Assign the user ID
            },
        });
        
        // Check if the new todo was created successfully
        if (newTodo) {
            // Respond with a success status and include the ID of the newly created todo
            res.status(201).json({
                success: true,
                todo: newTodo.id,
            });
        } else {
            // Respond with a failure status if todo creation failed
            res.status(500).json({
                success: false,
                message: "Failed to create new todo",
            });
        }
    } catch (e) {
        // Log the error for debugging purposes
        console.log(e);
        // Respond with a generic error message if something goes wrong
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
});



export default router;
